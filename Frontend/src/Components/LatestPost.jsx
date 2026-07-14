import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { imageUrl } from "../services/Endpoint";

export default function LatestPost({ posts = [] }) {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const moveCarousel = (direction) => {
    carouselRef.current?.scrollBy({
      left: direction * Math.min(carouselRef.current.clientWidth * 0.82, 900),
      behavior: "smooth",
    });
  };

  return (
    <div className="container latest-posts">
      <h2 className="section-title">Latest Blogs</h2>

      <div className="carousel-shell">
        {posts.length > 0 && (
          <>
            <button className="carousel-control carousel-prev" onClick={() => moveCarousel(-1)} aria-label="Previous blogs">
              <FaChevronLeft />
            </button>
            <button className="carousel-control carousel-next" onClick={() => moveCarousel(1)} aria-label="Next blogs">
              <FaChevronRight />
            </button>
          </>
        )}

        <div className="blog-carousel" ref={carouselRef}>
          {posts.length === 0 ? (
            <h3 className="empty-state">No Blogs Available</h3>
          ) : (
            posts.map((blog) => (
              <article className="carousel-card" key={blog._id}>
                <div className="blog-card">
                  <img src={imageUrl(blog.image)} alt={blog.title} />
                  <div className="blog-content">
                    <h3>{blog.title}</h3>
                    <p>{blog.desc?.length > 120 ? `${blog.desc.substring(0, 120)}...` : blog.desc}</p>
                    <button onClick={() => navigate(`/blog/${blog._id}`)}>Read More</button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
