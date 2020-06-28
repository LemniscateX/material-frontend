const URL = 'http://localhost:10101'

const checkLoginStatus = (data) => {
    if (!data.ok && (data.err === 'token is expired' || data.err === 'user does not exist')) {
        localStorage.removeItem('user');
        window.location.reload();
    }
}

export const getLocalUser = () => {
    const s = localStorage.getItem('user');
    if (!s) {
        return undefined;
    }

    return JSON.parse(s);
}

const getLocalToken = () => {
    const user = getLocalUser();
    if (!user) {
        return undefined;
    }

    return user.token;
}

export const fetchMaterialList = async (page, limit) => {
    const p = page || 1;
    const l = limit || 5;
    const resp = await fetch(`${URL}/store?page=${p}&limit=${l}`, {
        headers: {
            'Authorization': getLocalToken(),
        }
    });
    const data = await resp.json();
    checkLoginStatus(data);
    return {
        materials: data.data.map((m) => {
            return {...m, key: m.name};
        }), totalCount: data.totalCount
    };
}

export const fetchHistoryList = async (page, limit) => {
    const p = page || 1;
    const l = limit || 5;
    const resp = await fetch(`${URL}/history?page=${p}&limit=${l}`, {
        headers: {
            'Authorization': getLocalToken(),
        }
    });
    const data = await resp.json();
    checkLoginStatus(data);
    return {
        histories: data.data.map((h) => {
            return {...h, key: h.id};
        }), totalCount: data.totalCount
    };
}

export const login = async (username, password) => {
    const resp = await fetch(`${URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    });
    const data = await resp.json();
    if (data.ok) {
        localStorage.setItem('user', JSON.stringify({
            username: username,
            token: data.token,
            isAdmin: data.isAdmin,
        }));
    }
    return data;
}

export const logout = async () => {
    const resp = await fetch(`${URL}/logout`, {
        method: 'POST',
        headers: {
            'Authorization': getLocalToken(),
        }
    })
    const data = await resp.json();
    if (data.ok) {
        localStorage.removeItem('user');
    }
    return data;
}

export const searchMaterial = async (pattern, page, limit) => {
    const p = page || 1;
    const l = limit || 5;
    const resp = await fetch(`${URL}/store/search?pattern=${pattern || ''}&page=${p}&limit=${l}`, {
        headers: {
            'Authorization': getLocalToken(),
        }
    });
    const data = await resp.json();
    checkLoginStatus(data);
    return {
        items: data.data.map((m) => {
            return {...m, key: m.name};
        }), totalCount: data.totalCount
    };
}

export const outMaterials = async (materials) => {
    let arr = [];
    for (let [key, value] of Object.entries(materials)) {
        if (value !== 0) {
            arr.push({"name": key, "amount": value});
        }
    }
    const resp = await fetch(`${URL}/store/out`, {
        method: 'POST',
        headers: {
            'Authorization': getLocalToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            list: arr
        })
    });
    const data = await resp.json();
    return data;
}

export const fetchUserList = async (page, limit) => {
    const p = page || 1;
    const l = limit || 5;
    const resp = await fetch(`${URL}/user?page=${p}&limit=${l}`, {
        headers: {
            'Authorization': getLocalToken(),
        }
    });
    const data = await resp.json();
    checkLoginStatus(data);
    return {
        users: data.data.map((u) => {
            return {...u, key: u.username};
        }), totalCount: data.totalCount
    };
}