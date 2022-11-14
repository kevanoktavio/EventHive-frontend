<template>
    <div class="vue-photo-upload">
        <form class="vue-photo-upload-form" @submit.prevent="photo_submit">
            <canvas 
                v-show="(vue_photo_selected && enableEdits)"
                id="vue-photo-upload-canvas"
                class="rounded-circle m-auto large-profilePicture"
                width="200" height="200">
            </canvas>
            <img
                v-show="!(vue_photo_selected && enableEdits)"
                id="vue-photo-upload-img"
                :src="vue_photoDefault"
                class="rounded-circle m-auto large-profilePicture" 
                width="200" height="200"/>
            <div class="flex">
                <label for="vue-photo-upload-file-input">
                    <a class="vue-photo-change-btn" v-show="enableEdits">Change Image</a>
                </label>
                <label for="vue-photo-upload-form-submit" v-show="(vue_photo_selected && enableEdits)">
                    <a class="vue-photo-set-btn" v-show="enableEdits">Set Image</a>
                </label>
                <!-- <label for="vue-photo-cancel-form-submit" v-show="(vue_photo_selected && enableEdits)">
                    <a class="vue-photo-cancel-btn" v-show="enableEdits">Cancel</a>
                </label> -->

                
            </div>
            <input class="hidden"
                id="vue-photo-upload-file-input"
                type="file"
                accept="image/*"
                @change="photo_change">
            <input class="hidden"
                id="vue-photo-upload-form-submit"
                type="submit"
                value="Upload Image">
                <!-- <input class="hidden"
                id="vue-photo-cancel-form-submit"
                type="reset"
                value="Cancel"> -->
            <span class="message"  v-show="vue_photo_selected && !enableEdits">Your edited image needs to be uploaded. Edit details to view.</span>
            <span class="message"  v-show="vue_photo_selected && enableEdits">Click and drag to adjust the position and scroll to control the zoom level</span>
        </form>
    </div>
</template>

<script>
export default {
    name: "ProfilePhotoUpload",
    data() {
        return {
            vue_photoDefault: this.photoDefault, // default photo if nothing selected
            vue_photo_selected: null, // select photo img
            vue_photo_cropped: null, // selected photo canvas
            vue_photoFile: null, // selected photo blob
        }
    },
    props: {
        photoDefault:{
            type: String,
            required: true,
        },
        enableEdits:{
            type: Boolean,
            required: true,
        },
        // buttonClass:{
        //     type: String
        // },
        showMessages:{
            type: Boolean,
            default: false
        }
    },
    methods: {
        photo_submit: function(e){
            if(!this.vue_photoFile){
                return;
            }
            this.$emit('photo-submit', e, this.vue_photoFile);
            this.uploadImage()
            this.updateImage()
            
            this.vue_photoDefault = this.vue_photo_cropped;
            this.vue_photo_selected = null;
            this.vue_photo_cropped = null;
            this.vue_photoFile = null;
            let canvas = document.getElementById('vue-photo-upload-canvas');
            canvas.__dragging = false;
            canvas.__zoom = 1;
            canvas.__position_x = 0;
            canvas.__position_y = 0;
            canvas.__last_positionX = canvas.height/2;
            canvas.__last_positionY = canvas.height/2;

        },
        uploadImage: async function () {
            console.log('Upload clicked')
            console.log("photoFile:", this.vue_photoFile)
            console.log("photoCropped:", this.vue_photo_cropped)
            console.log("photoSelected", this.vue_photo_selected)
            // Get the presigned URL
            const response = await this.axios({
                method: 'GET',
                url: 'https://xt96j6drmd.execute-api.ap-southeast-1.amazonaws.com/uploads'
            })
            console.log('Response: ', response)
            console.log('Uploading: ', typeof this.vue_photo_cropped, this.vue_photo_cropped)
            // let binary = atob(String(this.vue_photoFile).split(',')[1])
            // let array = []
            // for (var i = 0; i < binary.length; i++) {
            //     array.push(binary.charCodeAt(i))
            // }
            // let blobData = new Blob([new Uint8Array(array)], { type: 'image/jpeg' })
            // console.log("blobData", blobData)
            // console.log('Uploading to: ', response.data.uploadURL)
            const result = await fetch(response.data.uploadURL, {
                method: 'PUT',
                body: this.vue_photoFile
            }) // TODO: check FORBIDDEN error
            console.log('Result: ', result)
            // Final URL for the user doesn't need the query string params
            let uploadURL = response.data.uploadURL.split('?')[0]
            console.log(`image url at ${result.url.split("?")[0]}`);

            //TODO: update the user's profile picture with uploadURL
        },
        photo_change: function(e){
            if (e.srcElement.files && e.srcElement.files[0]) {
                this._photoFile = e.srcElement.files[0];
                
                let reader = new FileReader();
                let vm = this;
                reader.onload = function (e) {
                    let img = new Image();
                    img.src = e.target.result;
                    img.onload = function(){ 
                        vm.drawImageOnCanvas(img);
                    };
                }
                reader.readAsDataURL(this._photoFile);
            } else {
                this.vue_photo_selected = null;
                this.vue_photo_cropped = null;
                this.vue_photoFile = null;
                this.vue_photoDefault = this.photoDefault;
                let canvas = document.getElementById('vue-photo-upload-canvas');
                canvas.__dragging = false;
                canvas.__zoom = 1;
                canvas.__position_x = 0;
                canvas.__position_y = 0;
                canvas.__last_positionX = canvas.height/2;
                canvas.__last_positionY = canvas.height/2;
            }
            this.$emit('photo-change', e);
        },
        drawImageOnCanvas: function(_img, x, y, zoom){
            let vm = this;
            let canvas = document.getElementById("vue-photo-upload-canvas");
            let ctx=canvas.getContext("2d");
            let img;
            if(_img) {
                img = _img;
                this.vue_photo_selected = _img;
            }else{
                img = this.vue_photo_selected;
            }
            let _dimension = Math.min(img.width, img.height);
            let _canvas_dimension = 256;
            let _x = x || 0;
            let _y = y || 0;
            let _zoom = zoom || 1;
            let _dimension_scaled_x = _canvas_dimension;
            let _dimension_scaled_y = _canvas_dimension;
            if(img.width < img.height){
                _dimension_scaled_y = img.height * _canvas_dimension / img.width ;
            } else {
                _dimension_scaled_x = img.width * _canvas_dimension / img.height ;
            }
            ctx.drawImage(img,
                0,
                0,
                img.width,
                img.height,
                -(_dimension_scaled_x - _canvas_dimension - _x*_zoom * 2)/2,
                -(_dimension_scaled_y - _canvas_dimension - _y*_zoom * 2)/2,
                _dimension_scaled_x*_zoom,
                _dimension_scaled_y*_zoom);
            // set canvas image as uploading image file
            canvas.toBlob(function(blob){
                vm.vue_photoFile = blob;
            });
            vm.vue_photo_cropped = canvas.toDataURL();
        },
    },
    mounted: function(){
        let canvas = document.getElementById('vue-photo-upload-canvas');
        let vm = this;
        canvas.__dragging = false;
        canvas.__zoom = 1;
        canvas.__position_x = 0;
        canvas.__position_y = 0;
        canvas.__last_positionX = canvas.height/2;
        canvas.__last_positionY = canvas.height/2;
        
        canvas.addEventListener('mousedown', function(e){
            canvas.__dragging = true;
            canvas.__last_positionX = e.offsetX;
            canvas.__last_positionY = e.offsetY;
        })
        canvas.addEventListener('mouseout', function(e){
            canvas.__dragging = false;
        });
        canvas.addEventListener('mouseup', function(e){
            canvas.__dragging = false;
        })
        canvas.addEventListener('mousemove', function(e){
            if(canvas.__dragging){
                canvas.__position_x += (e.offsetX - canvas.__last_positionX);
                canvas.__position_y += (e.offsetY - canvas.__last_positionY);
                canvas.__last_positionX = e.offsetX;
                canvas.__last_positionY = e.offsetY;
                vm.drawImageOnCanvas(null, canvas.__position_x, canvas.__position_y, canvas.__zoom);
            }
        })
        canvas.addEventListener('wheel', function(e){
            e.preventDefault();
            if(e.deltaY < 0){
                canvas.__position_x -= 10;
                canvas.__position_y -= 10;
                canvas.__zoom *= 1.1;
            } else {
                canvas.__position_x += 10;
                canvas.__position_y += 10;
                canvas.__zoom *= 0.9;                            
            }
            vm.drawImageOnCanvas(null, canvas.__position_x, canvas.__position_y, canvas.__zoom);
        })
    },
}    
</script>

<style>
    
    label{
        margin: 0;
    }
    .vue-photo-upload{
        position: relative;
        cursor: pointer;
    }
    .vue-photo-upload canvas{
        cursor: move;
    }
    .vue-photo-upload-form{
        position: relative;
    }
    .hidden{
        display: none;
    }
    .label-block{
        display: block;
    }
    .vue-photo-change-btn{
        text-align: center;
        padding: .5rem .7rem;
        border-radius: 25px;
        background: #779977;
        color: #fff !important;
        margin: 10px 5px;
        display: inline-block;
    }
    .vue-photo-set-btn{
        text-align: center;
        padding: .5rem .7rem;
        border-radius: 25px;
        background: #D3E0D7;
        color: #000 !important;
        margin: 10px 5px;
        display: inline-block;
    }
    /* .vue-photo-cancel-btn{
        text-align: center;
        padding: .5rem .7rem;
        border-radius: 25px;
        background: #bd5959;
        color: #000 !important;
        margin: 10px 5px;
        display: inline-block;
    }*/
    .message{
        padding: 1rem;
        background: #eee;
        border-radius: 3px;
        display: flex;
        justify-content: center;
    }
    .flex{
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
</style>