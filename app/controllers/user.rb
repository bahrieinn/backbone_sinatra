####### GET ################

get '/users' do
  if request.xhr?
    content_type :json

    users = User.all
    users.to_json
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