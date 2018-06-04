var expect = require('expect');
var { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'Jen'
        ,text = 'some message'
        ,message = generateMessage(from,text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from,text});
    })
})

describe('generateLocationMessage', () => {
    it('should generate correct location message object', () => {
        var from = 'Jen'
        ,coords = {latitude:1,longitude:1}
        ,url = 'https://www.google.com/maps?q=1,1';
        var message = generateLocationMessage(from,coords);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from,url});
    })
})