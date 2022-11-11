const Yup = require("yup");

exports.articleSchemaValidation = Yup.object().shape({
  title: Yup.string()
    .required(" عنوان الزامی است")
    .min(3, " عنوان حداقل 3 کاراکتر است")
    .max(256, " عنوان حداکثر 256 کاراکتر است"),
  summery: Yup.string()
    .required(" خلاصه الزامی است")
    .min(3, " خلاصه حداقل 3 کاراکتر است")
    .max(256, " خلاصه حداکثر 256 کاراکتر است"),
  body: Yup.string()
    .required(" متن اصلی الزامی است")
    .min(3, " متن اصلی حداقل 3 کاراکتر است"),
  thumbnail: Yup.string().required("تصویر اصلی اجباری است"),
  category:Yup.string().required("دسته بندی الزامی است")
});
