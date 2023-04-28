var {RateLimiterMemory} = require('rate-limiter-flexible');

var rateLimiter = new RateLimiterMemory({
    keyPrefix: 'middleware',
    points: 10,
    duration: 1,
});

const rateLimiterAuth = (req, res, next) => {
    if (req.url.startsWith('/users')) {
        rateLimiter.consume(req.ip + req.url)
            .then(() => {
                next();
            })
            .catch(() => {
                console.error('Too Many Requests', req.ip, req.url);
                res.status(429).send('Too Many Requests');
            });
    } else {
        next();
    }
};

module.exports = rateLimiterAuth;
