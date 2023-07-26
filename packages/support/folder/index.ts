import { basename, dirname } from "path";
import * as fs from "fs-extra";

import { type Constant } from "@acme/constant";
import curd from "@acme/curd";
import { type Library, type Pending } from "@acme/db";

type EmitOption = { type: "image" | "folder"; current: number };

interface Props {
  library: Library;
  emit?: (option: EmitOption) => void;
  onError?: (err: unknown) => void;
}

const addFail = (path: string, library: Library) => {
  void curd.fail.create({
    libraryId: library.id,
    path,
  });
};

/**
 * Folder Start
 * https://github.com/rao-pics/rao-pics/issues/227
 *
 * folder id   => folder-1/folder-11/folder-111
 * folder name => folder-111
 */
export const startFolder = (props: Props) => {
  const { library, emit, onError } = props;

  const option: EmitOption = {
    type: "image",
    current: 0,
  };

  void curd.pending.get({ libraryId: library.id }).then(async (pendings) => {
    for (const p of pendings) {
      try {
        option.current++;

        if (p.type === "delete") {
          // delete image
          await deleteImage(p.path, library);
        } else if (p.type === "update") {
          // 好像不存在此情况，修改文件名， delete -> create
        } else if (p.type === "create") {
          const res = await createImage(p, library);
          if (!res) addFail(p.path, library);
        }

        await curd.pending.delete({ path: p.path });
        emit?.(option);
      } catch (e) {
        addFail(p.path, library);
        await curd.pending.delete({ path: p.path });
        onError?.(e);
      }
    }
  });
};

const createImage = async (p: Pending, library: Library) => {
  const filenameAndExt = basename(p.path);
  const folder = dirname(p.path);
  const folderId = folder.replace(library.dir + "/", "").replace(/\//g, "-");
  const folderName = folder.split("/").pop();
  const [filename, ext] = filenameAndExt.split(".");
  const stats = fs.statSync(p.path);
  const path = p.path.replace(library.dir + "/", "");

  // TODO: sharp 打包问题未解决

  return await curd.image.create({
    libraryId: library.id,
    path,
    name: filename || Date.now().toString(),
    ext: ext as Constant["ext"],
    thumbnailPath: path,
    size: stats.size,
    createTime: stats.ctime,
    lastTime: stats.mtime,
    width: 0,
    height: 0,
    folders: [{ id: folderId, name: folderName }],
  });
};

const deleteImage = async (path: string, library: Library) => {
  const res = await curd.image.get({ path: path.replace(library.dir + "/", "") });
  const image = res[0];

  if (image) {
    await curd.image.update({
      id: image.id,
      libraryId: library.id,
      folders: [],
    });
    await curd.image.delete({ id: image.id });

    // TODO: sharp 打包问题未解决, 不需要缩略图
    // if (image.thumbnailPath) {
    //   await fs.remove(join(thumbnailDirCache, library.id.toString(), image.thumbnailPath));
    // }
  }
};
