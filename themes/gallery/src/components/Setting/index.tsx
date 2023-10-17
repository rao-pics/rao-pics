import type { ChangeEvent } from "react";
import { useRouter } from "next/router";
import {
  AdjustmentsHorizontalIcon,
  AdjustmentsVerticalIcon,
  ArrowsUpDownIcon,
  FolderMinusIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import { useRecoilState } from "recoil";

import type { SettingType } from "~/states/setting";
import { settingSelector } from "~/states/setting";
import { trpc } from "~/utils/trpc";
import styles from "./index.module.css";

const Setting = () => {
  const router = useRouter();
  const [setting, setSetting] = useRecoilState(settingSelector);

  const { data: folderTree } = trpc.folder.findTree.useQuery();

  console.log(folderTree);

  const handleLayoutChange = async (layout: SettingType["layout"]) => {
    setSetting((prev) => ({
      ...prev,
      layout,
    }));
    await router.replace("/" + layout);
  };

  const changeOrderBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setSetting((prev) => ({
      ...prev,
      orderBy: {
        modificationTime: e.target
          .value as SettingType["orderBy"]["modificationTime"],
      },
    }));
  };

  return (
    <>
      <div className="setting drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer"
            className={`drawer-button glass btn-md btn-circle btn fixed left-3 top-3 transition-all duration-200 ease-in`}
          >
            <AdjustmentsHorizontalIcon className="h-6 w-6" />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="min-h-full w-80 bg-base-100 p-4 md:w-96">
            <div className="rounded-md border border-base-content/10 bg-base-200/30 px-4">
              <div className={styles.row}>
                <span className={styles.rowTitle}>
                  <AdjustmentsVerticalIcon className="mr-1 h-4 w-4" />
                  布局方式
                </span>

                <div className="join">
                  <button
                    onClick={() => handleLayoutChange("masonry")}
                    className={`btn-sm join-item btn font-normal ${
                      setting.layout === "masonry" ? "btn-primary" : ""
                    }`}
                  >
                    瀑布流
                  </button>
                  <button
                    onClick={() => handleLayoutChange("responsive")}
                    className={`btn-sm join-item btn font-normal ${
                      setting.layout === "responsive" ? "btn-primary" : ""
                    }`}
                  >
                    自适应
                  </button>
                </div>
              </div>

              <div className={styles.row}>
                <span className={styles.rowTitle}>
                  <ArrowsUpDownIcon className="mr-1 h-4 w-4" />
                  排序方式
                </span>

                <select
                  value={setting.orderBy.modificationTime}
                  onChange={changeOrderBy}
                  className="select select-sm bg-base-200 font-normal focus:outline-none"
                >
                  <option value={"asc"}>↑ 添加时间</option>
                  <option value={"desc"}>↓ 添加时间</option>
                </select>
              </div>
            </div>

            <div className="relative mt-4 rounded-md border border-base-content/10 bg-base-200/30 ">
              {folderTree && <FileTree data={folderTree} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface Folder {
  name: string;
  id: string;
  pid: string | null;
  description: string | null;
  passwordTips: string | null;
  children?: Folder[];
}

interface FileTreeProps {
  data: Folder[];
}

function FileTree({ data }: FileTreeProps) {
  const Document = ({ data }: { data: Folder }) => {
    return (
      <li>
        <span>
          <FolderMinusIcon className="h-4 w-4" />
          {data.name}
        </span>
      </li>
    );
  };

  const FolderRoot = ({ data }: { data: Folder }) => {
    return (
      <li>
        <details>
          <summary>
            <FolderOpenIcon className="h-4 w-4" />
            {data.name}
          </summary>
          <ul>
            {data.children?.map((item) => {
              if (!item.children?.length) {
                return <Document key={item.id} data={item} />;
              } else {
                return <FolderRoot key={item.id} data={item} />;
              }
            })}
          </ul>
        </details>
      </li>
    );
  };

  return (
    <ul className="menu w-full text-base">
      {data.map((item) => {
        if (!item.children?.length) {
          return <Document key={item.id} data={item} />;
        } else {
          return <FolderRoot key={item.id} data={item} />;
        }
      })}
    </ul>
  );
}

export default Setting;