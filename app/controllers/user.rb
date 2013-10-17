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