export type DataTransform = (data: { [prop: string]: any }) => any;
type DownloadOptions = {
  validate?: boolean,
  transform?: DataTransform
};

namespace DownloadOptions {
  export const Default = {
    validate: true
  };

  export function withDefaults(options: DownloadOptions | undefined) {
    return Object.assign(Default, options);
  }
}

export default DownloadOptions
