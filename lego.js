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
    'limit',
    'format'
];

function cloneFriend(friend) {

    return Object.keys(friend).reduce(function (result, key) {
        result[key] = friend[key];

        return result;
    }, {});
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var friends = collection.map(cloneFriend);
    var functions = [].slice.call(arguments, 1);
    functions.sort(function (func1, func2) {
        return FUNCTION_PRIORITY.indexOf(func1.name) > FUNCTION_PRIORITY.indexOf(func2.name);
    });

    return functions.reduce(function (result, func) {
        return func(result);
    }, friends);
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Array}
 */
exports.select = function () {
    var keys = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (friend) {
            return keys.reduce(function (result, key) {
                if (friend.hasOwnProperty(key)) {
                    result[key] = friend[key];
                }

                return result;
            }, {});
        });
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {

    return function filterIn(collection) {
        return collection.filter(function (friend) {
            return values.some(function (value) {
                return value === friend[property];
            });
        });
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
        return collection.sort(function (friend1, friend2) {
            return friend1[property] > friend2[property] ? order === 'asc' : order === 'desc';
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {

    return function format(collection) {
        collection.forEach(function (friend) {
            friend[property] = formatter (friend[property]);

            return friend;
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
        return collection.slice(0, count);
    };
};
