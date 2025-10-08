export const checkKey = (dict, key) => {
    return (key in dict && dict[key] != null)
}