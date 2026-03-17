const performanceTimer = (req, res, next)=> {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        if(duration > 500){
            console.warn(
                `[SLOW REQUEST] ${req.method} ${req.originalUrl} - ${duration}ms`
            );
        }
    });
    next();
};

module.exports = { performanceTimer };