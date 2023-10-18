const fs = require("fs");

export const deleteStorageFiles = (filesUrl: string[]) => {
  filesUrl?.map((itm: string) => {
    fs.unlink(`uploads/${itm}`, (err: Error) => {
      if (err) {
        console.error(err);
      } else {
        console.log("successfully");
      }
    });
  });
};
