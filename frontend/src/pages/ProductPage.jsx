import {
  ArrowLeftIcon,
  EditIcon,
  Trash2Icon,
  CalendarIcon,
  UserIcon,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "@clerk/clerk-react";

import LoadingSpinner from "../components/LoadingSpinner";
import CommentsSection from "../components/CommentSection";
import { useProduct, useDeleteProduct } from "../hooks/useProducts";

/* ------------------------- Utils ------------------------- */
const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));

/* --------------------- Sub Components -------------------- */
function ProductHeader({ productId, isOwner, onDelete, isDeleting }) {
  return (
    <div className="flex items-center justify-between">
      <Link to="/" className="btn btn-ghost btn-sm gap-1">
        <ArrowLeftIcon className="size-4" />
        Back
      </Link>

      {isOwner && (
        <div className="flex gap-2">
          <Link
            to={`/edit/${productId}`}
            className="btn btn-ghost btn-sm gap-1"
          >
            <EditIcon className="size-4" />
            Edit
          </Link>

          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="btn btn-error btn-sm gap-1"
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <Trash2Icon className="size-4" />
            )}
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function ProductImage({ src, title }) {
  return (
    <div className="card bg-base-300 shadow-lg">
      <figure className="p-4">
        <img
          src={src}
          alt={title}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          className="rounded-xl w-full h-80 object-cover"
        />
      </figure>
    </div>
  );
}

function ProductDetails({ product }) {
  return (
    <div className="card bg-base-300 shadow-lg">
      <div className="card-body space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {product.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm opacity-60">
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-4" />
            {formatDate(product.createdAt)}
          </div>

          <div className="flex items-center gap-1">
            <UserIcon className="size-4" />
            {product.user?.name}
          </div>
        </div>

        <div className="divider" />

        <p className="leading-relaxed opacity-80">
          {product.description}
        </p>

        {product.user && (
          <>
            <div className="divider" />
            <div className="flex items-center gap-4 bg-base-200 p-4 rounded-xl">
              <img
                src={product.user.imageUrl}
                alt={product.user.name}
                className="w-14 h-14 rounded-full ring ring-primary"
              />
              <div>
                <p className="font-semibold">{product.user.name}</p>
                <p className="text-xs opacity-60">Product Creator</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------- Main Page ------------------------ */
function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const { data: product, isLoading, error } = useProduct(id);
  const deleteProduct = useDeleteProduct();

  const isOwner = useMemo(
    () => userId === product?.userId,
    [userId, product?.userId]
  );

  const handleDelete = useCallback(() => {
    if (!id) return;

    if (confirm("Delete this product permanently?")) {
      deleteProduct.mutate(id, {
        onSuccess: () => navigate("/"),
      });
    }
  }, [id, deleteProduct, navigate]);

  if (isLoading) return <LoadingSpinner />;

  if (error || !product) {
    return (
      <div className="alert alert-error max-w-md mx-auto">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProductHeader
        productId={product.id}
        isOwner={isOwner}
        onDelete={handleDelete}
        isDeleting={deleteProduct.isPending}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <ProductImage src={product.imageUrl} title={product.title} />
        <ProductDetails product={product} />
      </div>

      <div className="card bg-base-300">
        <div className="card-body">
    <CommentsSection productId={id} comments={product.comments} currentUserId={userId} />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
