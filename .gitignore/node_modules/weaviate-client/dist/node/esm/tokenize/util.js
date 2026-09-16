export const parseResult = (res) => ({
    indexed: res.indexed || [],
    query: res.query || [],
});
