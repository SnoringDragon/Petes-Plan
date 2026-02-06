module.exports = Buffer.from(process.env.JWT_SECRET_KEY, 'latin1');
delete process.env.JWT_SECRET_KEY;
