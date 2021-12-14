module.exports = (plugin) => {
    plugin.controllers.controllerA.find = (ctx) => {};

    plugin.policies[newPolicy] = (ctx) => {};

    plugin.routes.push({
        method: 'GET',
        path: '/countries',
        handler: 'controller.action',
    });

    return plugin;
};