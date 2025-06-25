
export default {
    /*=============================================m_ÔÔ_m=============================================\
        Collection API
    \================================================================================================*/
    /*=============================================m_ÔÔ_m=============================================\
        Airtable API
    \================================================================================================*/
    async createRecord({ collectionId, data }, wwUtils) {
        const websiteId = wwLib.wwWebsiteData.getInfo().id;

        let response = null;
        wwUtils?.log('info', `Creating a record for _wwCollection(${collectionId})`, {
            preview: data,
            type: 'request',
        });

        /* wwFront:start */
        response = await axios.post(
            `//${window.location.hostname}/ww/cms_data_sets/${collectionId}/airtable/record`,
            { data }
        );
        /* wwFront:end */

        const record = response.data.data;
        const collection = wwLib.$store.getters['data/getCollections'][collectionId];
        if (!collection) return null;
        const collectionData = Array.isArray(collection.data) ? collection.data : [];
        wwLib.$store.dispatch('data/setCollection', {
            ...collection,
            total: collection.total + 1,
            data: [...collectionData, record],
        });

        return record;
    },
    async updateRecord({ collectionId, recordId, data }, wwUtils) {
        const websiteId = wwLib.wwWebsiteData.getInfo().id;

        let response = null;
        wwUtils?.log('info', `Updating record ${recordId} for _wwCollection(${collectionId})`, {
            preview: data,
            type: 'request',
        });
        /* wwFront:start */
        response = await axios.patch(
            `//${window.location.hostname}/ww/cms_data_sets/${collectionId}/airtable/record/${recordId}`,
            { data }
        );
        /* wwFront:end */

        const record = response.data.data;
        const collection = _.cloneDeep(wwLib.$store.getters['data/getCollections'][collectionId]);
        if (!collection) return null;
        const collectionData = Array.isArray(collection.data) ? collection.data : [];
        const recordIndex = collectionData.findIndex(item => item && item.id === recordId);
        collectionData.splice(recordIndex, 1, record);
        wwLib.$store.dispatch('data/setCollection', { ...collection, data: collectionData });

        return record;
    },
    async deleteRecord({ collectionId, recordId }, wwUtils) {
        const websiteId = wwLib.wwWebsiteData.getInfo().id;

        let response = null;
        wwUtils?.log('info', `Deleting record ${recordId} for _wwCollection(${collectionId})`, { type: 'request' });
        /* wwFront:start */
        response = await axios.delete(
            `//${window.location.hostname}/ww/cms_data_sets/${collectionId}/airtable/record/${recordId}`
        );
        /* wwFront:end */

        const record = response.data.data;
        const collection = _.cloneDeep(wwLib.$store.getters['data/getCollections'][collectionId]);
        if (!collection) return null;
        const collectionData = Array.isArray(collection.data) ? collection.data : [];
        const recordIndex = collectionData.findIndex(item => item && item.id === recordId);
        collectionData.splice(recordIndex, 1);
        wwLib.$store.dispatch('data/setCollection', {
            ...collection,
            total: collection.total - 1,
            data: collectionData,
        });

        return record;
    },
    async syncRecord({ collectionId, recordId }, wwUtils) {
        const websiteId = wwLib.wwWebsiteData.getInfo().id;
        wwUtils?.log('info', `Syncing record ${recordId} for _wwCollection(${collectionId})`, { type: 'request' });
        const response = await axios.get(
            `${wwLib.wwApiRequests._getPluginsUrl()}/hook/designs/${websiteId}/cms_data_sets/${collectionId}/sync/${recordId}/update`
        );
        const record = response.data.data;

        const collection = _.cloneDeep(wwLib.$store.getters['data/getCollections'][collectionId]);
        if (!collection) return null;
        const collectionData = Array.isArray(collection.data) ? collection.data : [];
        const recordIndex = collectionData.findIndex(item => item && item.id === recordId);
        if (recordIndex === -1) {
            collectionData.push(record);
            wwLib.$store.dispatch('data/setCollection', {
                ...collection,
                total: collection.total + 1,
                data: collectionData,
            });
        } else {
            collectionData.splice(recordIndex, 1, record);
            wwLib.$store.dispatch('data/setCollection', { ...collection, data: collectionData });
        }

        return record;
    },
};
