const Product = require("../models/productModel")
const ApiFeatures = require("../utils/apifeatures")
const cloudinary = require("cloudinary");

//create product -- ADMIN
    exports.createProduct = async(req,res)=>{
        try {
            let images = [];

            if (typeof req.body.images === "string") {
              images.push(req.body.images);
            } else {
              images = req.body.images;
            }
          
            const imagesLinks = [];
          
            for (let i = 0; i < images.length; i++) {
              const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
              });
          
              imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
              });
            }
          
            req.body.images = imagesLinks;
            
        req.body.user = req.user.id;    
        const product = await Product.create(req.body)
    
        res.status(201).json({
            success:true,
            product
        })
    }
    catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }
} 

//get all products
    exports.getAllProducts = async(req, res)=>{
        
        try {
        const resultPerPage = 8;
        const productsCount = await Product.countDocuments();
        const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);  //search() ,filter() and pagination() are the functions i made in ApiFeatures 
        const products = await apiFeature.query; 
    
        res.status(200).json({
            success:true,
            products,
            productsCount,
            resultPerPage
            })
    }
    catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }
} 

//get all products -- ADMIN
exports.getAdminProducts = async(req, res)=>{
        
    try {

    const products = await Product.find(); 

    res.status(200).json({
        success:true,
        products,
        })
}
catch (error) {
    res.status(400).json({
        success:false,
        message:error
    })
}
} 

//update product -- ADMIN
    exports.updateProduct = async(req, res)=>{
        try {
        let product = await Product.findById(req.params.id)
    
        if(!product){
            return res.status(500).json({
                success:false,
                message:"Product not found"
            })
        }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }
    
        product = await Product.findByIdAndUpdate(product, req.body, {
            new:true,
            runValidators:true, 
            useFindAndModify:false
        })
    
        res.status(200).json({
            success:true,
            product
            })
    }
    catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }
} 

//Delete product -- Admin
    exports.deleteProduct = async(req, res)=>{
        try {
        let product = await Product.findById(req.params.id)
    
        if(!product){
            return res.status(500).json({
                success:false,
                message:"Product not found"
                })
        }

         // Deleting Images From Cloudinary
         for (let i = 0; i < product.images.length; i++) {
          await cloudinary.v2.uploader.destroy(product.images[i].public_id);
          }

    
        await Product.deleteOne(product)
    
        res.status(200).json({
            success:true,
            message:"Product deleted successfully"
            })
    }
    catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }
}

//get single product details
    exports.getProductDetails = async(req, res)=>{
        try {
        let product = await Product.findById(req.params.id)
    
        if(!product){
            return res.status(500).json({
                success:false,
                message:"Product not found"
                })
        }
    
        res.status(200).json({
            success:true,
            product
            })
    }
    catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }
}

//create new review or update the review
exports.createProductReview = async(req, res)=>{
    try {
        
        const{rating, comment, productId} = req.body;
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }

        const product = await Product.findById(productId)
        const isReviewed = product.reviews.find(rev=> rev.user.toString() === req.user._id.toString())

        if(isReviewed){
            product.reviews.forEach((rev) => {
                if(rev.user.toString() === req.user._id.toString()){
                    rev.rating = rating 
                    rev.comment = comment
                }
                
            })
        }
        else{
            product.reviews.push(review)
            product.numOfReviews = product.reviews.length
        }

        let avg = 0;

        product.reviews.forEach((rev) =>{
            avg += rev.rating 
        })
        product.ratings = avg / product.reviews.length;

        await product.save({validateBeforeSave: false})

        res.status(200).json({
            success:true,
            })

    }
    catch (error) {
        res.status(400).json({
        success:false,
        message:error
    })
}
}

//get all reviews of a product
exports.getProductReviews = async(req, res)=>{
    try {
    let product = await Product.findById(req.query.id)

    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found"
            })
    }

    res.status(200).json({
        success:true,
        reviews: product.reviews
        })
}
catch (error) {
    res.status(400).json({
        success:false,
        message:error
    })
}
}

//delete a review
exports.deleteReview = async(req, res)=>{
    try {
    let product = await Product.findById(req.query.productId.toString())

    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found"
            })
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id)

    let avg = 0;

    reviews.forEach((rev) =>{
        avg += rev.rating 
    })

    let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    },
    {
        new:true,
        runValidators:true,
        useFindAndModify:false
    }
    )

    res.status(200).json({
        success:true
    })
}
catch (error) {
    res.status(400).json({
        success:false,
        message:error
    })
}
}
