const URL = 'http://localhost:10101'

const checkLoginStatus = (data) => {
    if (!data.ok && (data.err === 'token is expired' || data.err === 'user does not exist')) {
        localStorage.removeItem('token');
        window.location.reload();
    }
}

export const getLocalUser = () => {
    const s = localStorage.getItem('token');
    if (!s) {
        return undefined;
    }

    return JSON.parse(s);
}

const getLocalToken = () => {
    const user =  getLocalUser();
    if (!user) {
        return undefined;
    }

    return user.token;
}

export const fetchMaterialList = async () => {
    const resp = await fetch(`${URL}/store`, {
        headers: {
            'Authorization': getLocalToken(),
        }
    });
    const data = await resp.json();
    checkLoginStatus(data);
    console.log(data);
    return data.data;
}

export const fetchHistoryList = async () => {
    const resp = await fetch(`${URL}/history`, {
        headers: {
            'Authorization': getLocalToken(),
        }
    });
    const data = await resp.json();
    checkLoginStatus(data);
    return data.data;
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
        localStorage.setItem('token', JSON.stringify({
            username: username,
            token: data.token,
            isAdmin: data.isAdmin,
        }));
    }
    return data;
}
