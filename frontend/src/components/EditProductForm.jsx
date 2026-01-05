import { ArrowLeftIcon, ImageIcon, TypeIcon, FileTextIcon, SaveIcon, CheckCircleIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

function EditProductForm({ product, isPending, isError, onSubmit }) {
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    imageUrl: product.imageUrl,
  });

  const [imageError, setImageError] = useState(false);

  const handleChange = (key) => (e) => {
    setFormData({ ...formData, [key]: e.target.value });
    if (key === "imageUrl") setImageError(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Back Link */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm mb-6 text-base-content/70 hover:text-primary transition"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Profile
        </Link>

        {/* Card */}
        <div className="relative card bg-base-100/80 backdrop-blur-xl border border-base-300 shadow-2xl">
          <div className="card-body space-y-6">
            {/* Header */}
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <SaveIcon className="size-6 text-primary" />
              Edit Product
            </h1>
            <p className="text-sm text-base-content/70">
              Update product details including title, image, and description
            </p>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(formData);
              }}
              className="space-y-5 mt-4"
            >
              {/* Title */}
              <div>
                <label className="text-sm font-medium mb-1 block">Product Title</label>
                <label className="input input-bordered flex items-center gap-2 bg-base-200 focus-within:ring-2 focus-within:ring-primary transition">
                  <TypeIcon className="size-4 opacity-50" />
                  <input
                    type="text"
                    placeholder="Product title"
                    className="grow"
                    value={formData.title}
                    onChange={handleChange("title")}
                    required
                  />
                </label>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-sm font-medium mb-1 block">Product Image</label>
                <label className="input input-bordered flex items-center gap-2 bg-base-200 focus-within:ring-2 focus-within:ring-primary transition">
                  <ImageIcon className="size-4 opacity-50" />
                  <input
                    type="url"
                    placeholder="Image URL"
                    className="grow"
                    value={formData.imageUrl}
                    onChange={handleChange("imageUrl")}
                    required
                  />
                </label>
              </div>

              {/* Image Preview */}
              {formData.imageUrl && !imageError && (
                <div className="relative rounded-xl overflow-hidden shadow-lg group">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl"
                    onError={() => setImageError(true)}
                  />
                  <span className="absolute bottom-3 right-3 badge badge-success gap-1">
                    <CheckCircleIcon className="size-3" />
                    Preview Ready
                  </span>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <div className="rounded-xl bg-base-200 border border-base-300 p-3 flex gap-2 focus-within:ring-2 focus-within:ring-primary transition">
                  <FileTextIcon className="size-4 opacity-50 mt-1" />
                  <textarea
                    placeholder="Describe your product benefits..."
                    className="grow bg-transparent resize-none focus:outline-none min-h-32"
                    value={formData.description}
                    onChange={handleChange("description")}
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {isError && (
                <div role="alert" className="alert alert-error alert-sm">
                  Failed to update. Please try again.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary w-full text-lg font-semibold relative overflow-hidden
                  shadow-[0_0_25px_rgba(99,102,241,0.35)]
                  hover:shadow-[0_0_40px_rgba(99,102,241,0.6)]
                  transition-all"
              >
                {isPending ? <span className="loading loading-spinner" /> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProductForm;
