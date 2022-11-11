const Yup = require('yup')

exports.menuSchemaValidation = Yup.object().shape({
    title:Yup.string().required("عنوان باید وارد شود"),
    parentId:Yup.string().required("والد باید وارد شود"),
    url:Yup.string().required("آدرس باید وارد شود")
})