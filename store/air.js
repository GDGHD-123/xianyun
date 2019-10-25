export const state = () => {
    return {
        // 搜索的历史记录
        history: [],
        drafts: []
    }
}

export const mutations = {
    // 设置history的值,data是搜索表单的对象
    setHistory(state, data) {
        // 把最新的记录追加到第一个
        state.history.unshift(data);
    },
    //往drafts添加数据
    setdrafts(state, data) {
        // 把最新的记录追加到第一个
        state.drafts.unshift(data);
    },
    // 清除用户数据
    cleandrafts(state, index) {
        state.drafts.splice(index, 1)
    },
    // 编写drafts数据
    compiledrafts(state, obj) {
        state.drafts.splice(obj.index, 1, obj.data)
    }
} 