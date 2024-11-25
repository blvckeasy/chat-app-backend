import { Emitter } from "@socket.io/component-emitter"; // polyfill of Node.js EventEmitter in the browser

class Encoder {
    /**
     * Encode a packet into a list of strings/buffers
     */
    encode(packet) {
        return [JSON.stringify(packet)];
    }
}

function isObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}

class Decoder extends Emitter {
    /**
     * Receive a chunk (string or buffer) and optionally emit a "decoded" event with the reconstructed packet
     */
    add(chunk) {
        const packet = JSON.parse(chunk);
        if (this.isPacketValid(packet)) {
            this.emit("decoded", packet);
        } else {
            throw new Error("invalid format");
        }
    }
    isPacketValid({ type, data, nsp, id }) {
        const isNamespaceValid = typeof nsp === "string";
        const isAckIdValid = id === undefined || Number.isInteger(id);
        if (!isNamespaceValid || !isAckIdValid) {
            return false;
        }
        switch (type) {
            case 0: // CONNECT
                return data === undefined || isObject(data);
            case 1: // DISCONNECT
                return data === undefined;
            case 2: // EVENT
                return Array.isArray(data) && typeof data[0] === "string";
            case 3: // ACK
                return Array.isArray(data);
            case 4: // CONNECT_ERROR
                return isObject(data);
            default:
                return false;
        }
    }
    /**
     * Clean up internal buffers
     */
    destroy() {}
}

export default { Encoder, Decoder };
