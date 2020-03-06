const axios = require('axios');

const Dev = require('../models/Dev');

const string_to_array =require('../utils/string_to_array');

module.exports = {

    async index(request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },
    
    async store(request, response){

        const { github_username , techs , latitude, longitude} = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev){
            const api_response = await axios.get(`https://api.github.com/users/${github_username}`);
        
            const { name = login, avatar_url, bio} = api_response.data;
        
            const techs_array = string_to_array(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude,latitude],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techs_array,
                location,
            })
        };
    
        return response.json(dev);
    },

    async update(request, response){

        const { github_username, name, avatar_url, bio, techs, latitude, longitude} = request.query;

        const location = {
            type: 'Point',
            coordinates: [longitude,latitude],
        };

        let dev = await Dev.findOne({github_username});

        techs_array = string_to_array(techs);

        /*if(dev){
            await Dev.update({$inc: {github_username}});
        };*/

        return response.json({message: "funcionalidade incompleta!"});
    },

    async destroy(request, response){
        const { github_username } = request.query;

        let dev = await Dev.findOne({github_username});

        if(dev){
            await Dev.remove(dev);
        }

        return response.json(dev);
    }
};