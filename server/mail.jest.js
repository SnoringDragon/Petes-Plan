const fetch = import('node-fetch');
const { decode } = require('libqp');

beforeEach(async () => {
    await ((await fetch).default)('http://localhost:8025/api/v1/messages', {
        method: 'DELETE'
    });
});

module.exports.getLatestEmail = async () => {
    const result = await (await (await fetch).default('http://localhost:8025/api/v2/messages?limit=1')).json();
    if (!result.count) return null;
    const mail = result.items[0];

    return {
        content: decode(mail.content.body),
        to: mail.Raw.To,
        raw: mail
    };
};
