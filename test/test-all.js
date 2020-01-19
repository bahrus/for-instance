const xt = require('xtal-test/index');
(async () => {
    const passed = await xt.runTests([
        {
            path: 'test/xtal-frappe-chart-test.html',
            expectedNoOfSuccessMarkers: 1,
        },
        {
            path: 'test/fetch-test.html',
            expectedNoOfSuccessMarkers: 1,
        },
    ]);
    if (passed)
        console.log("Tests Passed.  Have a nice day.");
})();
