import gc from '../GarbageCollector';
var io = require('@pm2/io');

var DataRepository = {

    data: {},
    metricKeys: io.metric({
        name    : 'pm2clusterCache keys'
    }),

    keys: function(){
        return Object.keys(DataRepository.data);
    },

    sendMetric: function(){
        DataRepository.metricKeys.set(DataRepository.keys().length);
    },

    optimize: function () {
        for (const [key, record] of Object.entries(DataRepository.data)) {
            if (!DataRepository.isValid(record)) {
                DataRepository.delete(key);
            }
        }

    },

    get: function (key) {
        DataRepository.sendMetric();
        return DataRepository.isValid(DataRepository.data[key]) ? DataRepository.data[key] : null;
    },

    set: function (key, data) {
        DataRepository.sendMetric();
        DataRepository.data[key] = data;
        gc.start(1000);
    },

    delete: function (key) {
        delete DataRepository.data[key];
        DataRepository.sendMetric();
    },

    isValid: function (record) {
        if (record === undefined) return false;

        var isValid = record.t >= new Date().getTime();
        if (!isValid) {
            DataRepository.delete(record.k);
        }
        return isValid;
    }
};

module.exports = {
    get: DataRepository.get,
    set: DataRepository.set,
    delete: DataRepository.delete,
    optimize: DataRepository.optimize,
    keys: DataRepository.keys
};