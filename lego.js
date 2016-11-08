'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var FUNCTION_PRIORITY = [
    'filterIn',
    'sortBy',
    'select',
    'format',
    'limit'
];

function cloneFriend(collection) {
    var friend = {};
    var keys = Object.keys(collection);
    keys.forEach(function (key) {
        friend[key] = collection[key];
    });

    return friend;
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var friends = [];
    for (var i = 0; i < collection.length; i++) {
        friends[i] = cloneFriend (collection[i]);
    }
    var functions = [].slice.call(arguments, 1);
    if (functions.length === 0) {
        return collection;
    }
    functions.sort(function (func1, func2) {
        return FUNCTION_PRIORITY.indexOf(func1.name) > FUNCTION_PRIORITY.indexOf(func2.name);
    });
    functions.forEach(function (func) {
        friends = func (friends);
    });

    return friends;
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Array}
 */
exports.select = function () {
    var keys = [].slice.call(arguments);
    var res = [];

    return function select(collection) {
        var i = 0;
        collection.forEach(function (friend) {
            res[i] = {};
            keys.forEach(function (key) {
                if ({}.hasOwnProperty.call(friend, key)) {
                    res[i][key] = friend[key];
                }
            });
            if (!(Object.keys(res[i]) === [])) {
                i++;
            }
        });

        return res;
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Array}
 */
exports.filterIn = function (property, values) {

    return function filterIn(collection) {
        var filterCollection = collection.filter(function (friend) {
            for (var i = 0; i < values.length; i++) {
                if (friend[property] === values[i]) {
                    return true;
                }
            }

            return false;
        });

        return filterCollection;
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {

    return function sortBy(collection) {
        collection.sort(function (friend1, friend2) {
            if (friend1[property] > friend2[property]) {
                return order === 'asc';
            }
            return order === 'desc';
        });

        return collection;
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Array}
 */
exports.format = function (property, formatter) {

    return function format(collection) {
        collection.forEach(function (friend) {
            // if ({}.hasOwnProperty.call(friend, property)) {
            friend[property] = formatter (friend[property]);
            // }
        });

        return collection;
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Array}
 */
exports.limit = function (count) {

    return function limit(collection) {
        collection.splice(count);

        return collection;
    };
};
