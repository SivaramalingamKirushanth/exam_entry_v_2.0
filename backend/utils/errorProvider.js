const errorProvider = (code, msg) => {
  const err = new Error(msg);
  err.statuscode = code;
  throw err;
};

export default errorProvider;
