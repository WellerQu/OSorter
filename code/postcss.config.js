module.exports = {
    plugins: [
        require('precss'),
        require('autoprefixer')({browsers: ['last 4 versions']})
    ]
};

