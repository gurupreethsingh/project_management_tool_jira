import React from 'react'

const AllCourses = () => {
  return (
    <div>
        <div className="header"><h1>All Courses</h1></div>
        <div className="seconday_header">
            <h3>Courses to get you started</h3>
            <p>Explore courses from experianced, real-work experts</p>
        </div>

        <div className="courses_carosol">
            <div className='course_categories'>
                Most popular, new, training
            </div>

            <div className="course_list_carosol">
                <div className="card">
                    <img src="" alt="" />
                    <h4>Title</h4>
                    <p>Instuctor name</p>
                    <p>4.5 rating</p>
                    <p>R 499 <del>R 3999</del></p>
                </div>
            </div>

            <div className="popular_topics">
                <ul><li>Web Development</li>
                <li>react</li>
                <li>css</li>
                <li>next js</li>
                <li>node js</li>
                <li>express.js </li>
                <li>html</li>
                <li>css</li>
                <li>javascript</li>
                <li>wordpress</li></ul>
            </div>
        </div>

        <div className="all_course_category_section">
        <div className="course_category">
                <button>filter</button>
                <select>
                    <option value="">Most Popular</option>
                    <option value="">highest Rated</option>
                    <option value="">Newest</option>
                </select>
            </div>

            <div className="mainsection">
                <div className="left_filters">
                    <div className="ratings">
                        rating dropdown
                    </div>

                    <div className="video_duration">
                        video duration drop down
                    </div>

                    <div className="topics">
                        topics drop down
                    </div>

                    <div className="subcategory">
                        subcategory
                    </div>

                    <div className="level">
                        levels dropdown
                    </div>

                    <div className="price">
                        price dropdown
                    </div>

                    <div className="features">
                        features drop down
                    </div>

                </div>

                <div className="right_course_list_section">
                    <div>
                        <div className="image_section">
                            <img src="" alt="" />
                        </div>
                        <div className="course_details">
                            course details.
                        </div>

                        <div className="price_section">
                            R 499
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="pagination_section">
            pagination
        </div>
      
    </div>
  )
}

export default AllCourses