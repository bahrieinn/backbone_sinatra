####### GET ################

get '/users' do
  if request.xhr?
    content_type :json

    users = User.all
    users.to_json
  else
  
  end
end

get '/users/:id' do
  if request.xhr?
    user = User.find(params[:id])
    user.to_json
  else
  end
end


####### POST ###############

post '/users'  do

  if request.xhr?
    content_type :json
    user_attributes = JSON.parse(request.body.read)
    user = User.new(user_attributes)
    if user.save!
      user_attributes.to_json
    else
      "User NOT saved!"
    end
  else
  end
  
end

put '/users/:id' do
  if request.xhr?
    content_type :json
    user = User.find(params[:id])
    new_attributes = JSON.parse(request.body.read)
    user.assign_attributes(new_attributes)
    if user.save!
      new_attributes.to_json
    else
      "User NOT saved!"
    end
  end
end

delete '/users/:id' do
  if request.xhr?
    user = User.find(params[:id])
    user.destroy
    {}.to_json
  else
  end
end