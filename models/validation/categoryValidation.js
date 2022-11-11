const Yup = require("yup");

exports.categorySchemaValidation = Yup.object().shape({
  title: Yup.string()
    .required("نام دسته بندی باید وارد شود")
    .min(3, "نام دسته بندی حداقل 3 کاراکتر است")
    .max(256, "نام دسته بندی حداکثر 256 کاراکتر است"),
  slug: Yup.string()
    .required("  اسلاگ باید وارد شود")
    .min(3, "  اسلاگ حداقل 3 کاراکتر است")
    .max(256, "اسلاگ حداکثر 256 کاراکتر است"),
});
