export default {
    features: {
        datasource: true,
    },
    editor: {
        settings: {
            edit: () => import('./src/components/SettingsEdit.vue'),
            summary: () => import('./src/components/SettingsSummary.vue'),
            getIsValid(settings) {
                return !!settings.privateData.apiKey;
            },
        },
        collection: {
            edit: () => import('./src/components/CollectionEdit.vue'),
            summary: () => import('./src/components/CollectionSummary.vue'),
            getIsValid(config) {
                return !!config.baseId && !!config.tableId && !!config.view;
            },
        },
    },
    actions: [
        {
            name: 'Create a record',
            code: 'createRecord',
            isAsync: true,
        },
        {
            name: 'Update a record',
            code: 'updateRecord',
            isAsync: true,
        },
        {
            name: 'Delete a record',
            code: 'deleteRecord',
            isAsync: true,
        },
        {
            name: 'Sync a record',
            code: 'syncRecord',
            isAsync: true,
        },
    ],
};
