import {expect} from 'chai';
import Client, {CLIENT_CONFIG_DEFAULTS} from '../src/Client';
import Connection from '../src/Connection';
import {CLIENT_STATES, CLIENT_EVENTS} from '../src/Constants';

describe('WebSocketTransport', function() {
  this.timeout(15000);

  it('Initiates WebSocket connection successfully', function(done) {
    const client = new Client({url: 'http://signalr.pwnt.co:1984/raw-connection'});
    client.start()
      .then(client => {
        expect(client.connection.transport.name).to.be.equal('webSockets');
        expect(client.state).to.be.equal(CLIENT_STATES.connected);
        done();
      })
      .catch(err => {
        console.error('ERROR', err);
        expect(true).to.be.equal(false);
        done();
      });
  });

  it('Closes a WebSocket connection sucessfully.', function(done) {
    const client = new Client({url: 'http://signalr.pwnt.co:1984/raw-connection'});
    client.start()
      .then(client => {
        console.log(`Connection state after initiating connection: ${client.state}`);
        expect(client.state).to.be.equal(CLIENT_STATES.connected);
        setTimeout(() => {
          client.connection.transport.stop();
          setTimeout(() => {
            expect(client.state).to.be.equal(CLIENT_STATES.disconnected);
            console.log(`State of client after disconnection: ${client.state}`);
            done();
          }, 1000);
        }, 500);
      })
      .catch(err => {
        expect(err).to.be.empty;
        done();
      })

  });
  it('Can successfully send messages to the server.', function(done) {
    const client = new Client({url: 'http://signalr.pwnt.co:1984/raw-connection'});
    client.start()
      .then(client => {
        expect(client.state).to.be.equal(CLIENT_STATES.connected);
        setTimeout(() => {
          client.connection.transport._send({type: 1, value: 'Jack Sparrow!'})
        }, 1000);
      })
      .then(() => done())
      .catch(err => {
        expect(err).to.be.empty;
        done();
      })
  })
});