require 'securerandom'

class UploadsController < ApplicationController
  def new
  end

  def create
    # Make an object in your bucket for your upload
    obj = S3_BUCKET.objects[SecureRandom.hex + '.png']

    # Upload the file
    obj.write(
      file: params[:file],
      acl: :public_read
    )

    # Create an object for the upload
    @upload = Upload.new(
        url: obj.public_url,
        name: obj.key
        )

    # Save the upload
    if @upload.save
    	render json: @upload, status: 200
    else
    	render json: {errors: @upload.errors.full_messages}, status: 422
    end
  end

  def index
  	@uploads = Upload.all
  end
end