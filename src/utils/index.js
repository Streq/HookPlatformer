(function () {
    define([
        "utils/dom",
        "utils/file",
        "utils/loop",
        "utils/array",
        "utils/math",
        "utils/transform2d",
        "utils/vector",
        "utils/view"
    ], function (
        Dom,
        File,
        Loop,
        Array,
        Math,
        Transform2d,
        Vector,
        View) {

        return {
            Dom: Dom,
            File: File,
            Loop: Loop,
            Array: Array,
            Math: Math,
            Transform2d: Transform2d,
            Vector: Vector,
            View: View
        }
    });
})();