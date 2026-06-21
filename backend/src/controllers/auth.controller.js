export async function checkAuth(req,res){
    const user = req.user;

    if(!user){
        return res.status(401).json({message: "Unauthorized"});
    }

    res.status(200).json(user);
}

