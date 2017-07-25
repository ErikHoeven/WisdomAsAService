/**
 * Created by erik on 7/25/17.
 */
function uploadFile(uploadFile) {
    console.info('upload file')


    $.ajax({
        url: '/signup/upload',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({selectedFiles: 'selectedFiles'} ),
        success: function (response) {
            console.info('response')

        }
    });

}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imgPreview').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

