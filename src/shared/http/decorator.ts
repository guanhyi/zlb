import { Subject, lastValueFrom, tap } from "rxjs";

import { signal } from "@preact/signals-react";

import { Inject } from "@wendellhu/redi";

import { HTTP_CLIENT } from ".";
import { NgHttp } from "./client";

import { switchLoading } from "../operator/switch-loading";

/**
 * 基础的请求loading处理
 */
export class BaseLoading {
  loading = signal(false);

  requestChangeLoading() {
    return switchLoading(this.loading);
  }
}

export class BaseCurd<T extends object, CodeType = any, F extends object = T> {
  basePath = "";
  path = "";

  requestLoading = new BaseLoading();

  findLoading = new BaseLoading();

  saveLoading = new BaseLoading();

  addLoading = new BaseLoading();

  deleteLoading = new BaseLoading();

  loading = signal(false);

  constructor(@Inject(HTTP_CLIENT) public _http: NgHttp) {
    const baseData = setParam(this);

    this.path = `${baseData.baseUrl}`;

    if (baseData.codeEnum) {
      const codeEnum = baseData.codeEnum as string;
      codeEnum.split(",").map((item) => {
        //@ts-ignore
        this.codeEnum.value[item] = [];
      });
    }
  }

  leadingOut: string = "LeadingOut";

  /**摊平数据 */
  flattenItems = (items: any[], key: string) => {
    return items.reduce((flattenedItems, item) => {
      flattenedItems.push(item);
      if (Array.isArray(item[key])) {
        flattenedItems = flattenedItems.concat(
          this.flattenItems(item[key], key)
        );
      }
      return flattenedItems;
    }, []);
  };

  // add = (form: any) => {
  //     return this._http
  //         .post<API.RemoteResultDTO<any>>(`${this.path}/Add`, form)
  //         .pipe(this.addLoading.requestChangeLoading())
  // }

  // find = (uuid: any) => {
  //     return this._http
  //         .get<API.RemoteResultDTO<T>>(`${this.path}/Find`, {
  //             uuid
  //         })
  //         .pipe(this.findLoading.requestChangeLoading())
  // }
  // page = (pageConfig: any) => {
  //     return this._http.get<API.RemoteResultDTO<API.PageDTO<T[]>>>(`${this.path}/GetList`, {
  //         ...pageConfig
  //     })
  // }

  // proPage = async ({ current, pageSize, ...pageConfig }: any) => {
  //     const newPageConfig = {
  //         page: current,
  //         limit: pageSize,
  //         ...pageConfig
  //     }

  //     const pageData = await lastValueFrom(this.page(newPageConfig))
  //     return { ...pageData.result }
  // }

  // save = (data: any) => {
  //     return this._http
  //         .post<API.RemoteResultDTO<any>>(`${this.path}/Edit`, {
  //             ...data
  //         })
  //         .pipe(this.saveLoading.requestChangeLoading())
  // }
  // del = (uuid: string) => {
  //     return this._http
  //         .post<API.RemoteResultDTO<any>>(`${this.path}/Delete`, { uuid })
  //         .pipe(this.deleteLoading.requestChangeLoading())
  // }

  downloadSimple(url: string) {
    const anchor = document.createElement("a");
    const fileName = url.split("/").pop()?.split("?")[0];
    if ("download" in anchor) {
      //html5 A[download]
      anchor.href = url;
      anchor.setAttribute("download", fileName || "");
      anchor.className = "download-js-link";
      anchor.innerHTML = "downloading...";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      setTimeout(function () {
        anchor.click();
        document.body.removeChild(anchor);
      }, 66);
      return true;
    }
    return true;
  }
}

const paramKey = `__api_params`;
const CACHE_SIZE = 1;
function setParam(target: any, key: string = paramKey): any {
  let params = target[key];
  if (typeof params === "undefined") {
    params = target[key] = {};
  }
  return params;
}

/**
 * 默认基准URL
 * - 有效范围：类
 */
export function BaseUrl(url: string, options?: { codeEnum: string }) {
  return function <TClass extends new (...args: any[]) => BaseCurd<any>>(
    target: TClass
  ): TClass {
    const params = setParam(target.prototype);

    params.baseUrl = url;
    if (options && options.codeEnum) {
      params.codeEnum = options.codeEnum;
    }

    return target;
  };
}
export function BaseCode(code: string) {
  return function <TClass extends new (...args: any[]) => BaseCurd<any>>(
    target: TClass
  ): TClass {
    const params = setParam(target.prototype);

    params.codeEnum = code;

    return target;
  };
}
