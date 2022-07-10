const status = (res) => {
    if (res.status !== 200) {
        throw new Error();
    }
    return res;
}

export {status}