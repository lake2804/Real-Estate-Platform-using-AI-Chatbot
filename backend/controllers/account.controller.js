import accountService from "../services/account.service.js"
const register = async (req, res) => {
    return accountService.register(req, res);
  
}

const getUser = async (req, res) => {
    return accountService.getUser(req, res);
}

const deleteUser = async (req, res) => {
    return accountService.deleteUser(req.query.email, res);
}

const updateUser = async (req, res) => {
    return accountService.updateUser(req, res);
}

export default { register , getUser, deleteUser , updateUser };
