// 用户管理
export const state = () => ({
    // 采用接口返回的数据结构
    userInfo: {},
})

export const mutations = {
    //修改用户数据
    setUserInfo(state, data) {
        state.userInfo = data
    },
    // 清除用户数据
    cleanUserInfo(state, data) {
        localStorage.removeItem("userInfo");
        state.userInfo = {};
    }
};

export const actions = {};