const errorProvider = (code, msg) => {
  const err = new Error(msg);
  err.statuscode = code;
  return err;
};

export default errorProvider;
