const Product = require('../model/product.model');
const Category = require('../model/categories.model');
const User = require('../model/user.model');
const Role = require('../model/roles.model');
const generateRandomPassword = require('../helper/autoPassword');
const { sendMail } = require('../helper/sendMail');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
class AdminController {
    async addUser(req, res) {
        try {
            const { name, email, role } = req.body;

            if (!name || !email || !role) {
                return res.status(400).json({
                    status: false,
                    message: 'All fields are required'
                });
            }
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    message: 'User already exists'
                });

            }

            const plainPassword = generateRandomPassword(10);

            const newUser = new User({
                name,
                email,
                password: plainPassword,
                role: role
            });



            const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            const loginUrl = `${process.env.BASE_URL}/auth/user/login`;
            console.log(loginUrl);

            const html = `<p>Hi , ${name}, </p>
            <p>Your Username: ${email}</p>
            <p>Your Password: ${plainPassword}</p>
            <p>Here is your login link: <a href="${loginUrl}">${loginUrl}</a></p>`;

            const isMailSent = await sendMail(email, html);

            if (isMailSent === 'failed') {
                return res.status(500).json({
                    status: false,
                    message: 'Failed to send email'
                });
            }

            await newUser.save();

            return res.status(201).json({
                status: true,
                message: 'User added successfully',
                token,
                data: {
                    userId: newUser._id,
                    email: newUser.email,
                    role: newUser.role
                }
            });

        } catch (error) {
            console.error('Error adding user:', error);
            return res.status(500).json({
                status: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: false,
                    message: 'Email and password are required'
                });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: 'Invalid email or password'
                });
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(401).json({
                    status: false,
                    message: 'Invalid email or password'
                });
            }
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({
                status: true,
                message: 'Login successful',
                token
            });

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: false,
                message: error.message || 'Internal server error'
            });
        }
    }


    async createRole(req, res) {
        try {
            const { roleName } = req.body;

            if (!roleName) {
                return res.status(400).json({
                    status: false,
                    message: 'Role name is required'
                });
            }

            const existingRole = await Role.findOne({ roleName });
            if (existingRole) {
                return res.status(400).json({
                    status: false,
                    message: 'Role already exists'
                });
            }

            const newRole = new Role({ roleName });
            await newRole.save();

            return res.status(201).json({
                status: true,
                message: 'Role created successfully',
                data: newRole
            });

        } catch (error) {
            console.error('Error creating role:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal server error'
            });
        }
    }

    async addCategory(req, res) {
        try {
            const { name } = req.body;
            const isExist = await Category.findOne({ name })
            console.log(isExist)
            if (isExist) {
                return res.status(400).json({
                    message: 'Category alrady exists..'
                })
            }
            const newCategory = new Category({
                name
            });

            await newCategory.save()
            return res.status(200).json({
                data: newCategory,
                message: "New Category Added"
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: false,
                message: error.message
            })
        }
    }

    async addProduct(req, res) {
        try {
            console.log(req.body)
            const authCheck = require('../middleware/authCheck');
            const { name, description, price, category  } = req.body;
            if (!name || !price || !category) {
                return res.status(400).json({
                    message: "All fealds are required.."
                })
            }
           

            const newProduct = new Product({
                name, description, price, category , subCategory: req.body.subCategory || null
            });

            await newProduct.save();

            return res.status(200).json({
                newProduct,
                message: "New Product is added..."
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.message
            })
        }
    }
    async getAllProductsCountByCategoryAndSubCategory(req, res) {
        try {
            const result = await Product.aggregate([
                {
                    $group: {
                        _id: {
                            category: "$category",
                            subCategory: "$subCategory"
                        },
                        productCount: { $sum: 1 },
                        products: { $push: "$$ROOT" }
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "_id.category",
                        foreignField: "_id",
                        as: "categoryInfo"
                    }
                },
                { $unwind: "$categoryInfo" },
                {
                    $lookup: {
                        from: "categories",
                        localField: "_id.subCategory",
                        foreignField: "_id",
                        as: "subCategoryInfo"
                    }
                },
                {
                    $unwind: {
                        path: "$subCategoryInfo",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: "$categoryInfo.name",
                        subCategory: "$subCategoryInfo.name",
                        productCount: 1,
                        products: 1
                    }
                }
            ]);
            return res.status(200).json({
                message: "Product count by category and subcategory",
                data: result
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: error.message
            });
        }
    }

    async getAllUsers(req,res){
        try {
            const allUsers = await User.aggregate([
              {
                $lookup:{
                    from:'roles',
                    localField:'role',
                    foreignField:'_id',
                    as:'roleInfo'
                }
              }  ,
                {
                    $unwind: '$roleInfo'
                },
                {
                    $match:{
                        'roleInfo.roleName':'User'
                    }
                },
                {
                    $project:{
                        name:1,
                        role:'$roleInfo.roleName'
                    }
                }
            ])
            return res.status(200).json({
                message:'All users fetched succesfully',
                data:allUsers
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message:error.message
            })
        }
    }
}


module.exports = new AdminController();