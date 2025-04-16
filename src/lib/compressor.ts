import Compressor from "compressorjs";

/**
 * Compresses an image file based on the provided options.
 *
 * @param {File} file - The image file to be compressed.
 * @param {Pick<Compressor.Options,'quality' | 'maxHeight' | 'maxWidth'>} options - The compression options. Defaults to quality: 0.7, maxWidth: 1280, maxHeight: 1280.
 * @returns {Promise<File>} A Promise that resolves with the compressed image file if successful, or rejects with an error if the compression fails or the file is not an image.
 */
export const compressImage = (
	file: File,
	options: Pick<Compressor.Options, "quality" | "maxHeight" | "maxWidth"> = {
		quality: 0.7,
		maxWidth: 1280,
		maxHeight: 1280,
	}
): Promise<File> =>
	new Promise((resolve, reject) => {
		if (!file) {
			reject("File not found");
		}

		const isImage = [
			"image/jpg",
			"image/jpeg",
			"image/png",
			"image/webp",
		].includes(file?.type);

		if (!isImage) {
			return resolve(file);
		}

		return new Compressor(file, {
			...options,
			convertSize: 0,
			convertTypes: ["image/jpg", "image/jpeg"],
			success(result: File) {
				resolve(result);
			},
			error(err: Error) {
				reject(err);
			},
		});
	});
