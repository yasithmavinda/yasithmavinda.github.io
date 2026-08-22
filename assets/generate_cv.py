import os
from PIL import Image, ImageDraw
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph

def prepare_circle_image(input_path, output_path, size=(280, 280)):
    """Crops profile photo to a circle with a white ring border."""
    img = Image.open(input_path).convert("RGBA")
    min_dim = min(img.size)
    left = (img.width - min_dim) // 2
    top = (img.height - min_dim) // 2
    img = img.crop((left, top, left + min_dim, top + min_dim))
    img = img.resize(size, Image.Resampling.LANCZOS)
    
    mask = Image.new('L', size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size[0], size[1]), fill=255)
    
    border_size = (size[0] + 16, size[1] + 16)
    final_img = Image.new('RGBA', border_size, (0, 0, 0, 0))
    
    border_mask = Image.new('L', border_size, 0)
    draw_border = ImageDraw.Draw(border_mask)
    draw_border.ellipse((0, 0, border_size[0], border_size[1]), fill=255)
    
    white_bg = Image.new('RGBA', border_size, (255, 255, 255, 255))
    final_img.paste(white_bg, (0, 0), mask=border_mask)
    final_img.paste(img, (8, 8), mask=mask)
    final_img.save(output_path, "PNG")

def draw_icon(c, icon_type, x, y):
    """Draws clean vector icons for contact items and timeline nodes."""
    c.saveState()
    c.setLineWidth(1.2)
    c.setStrokeColor(colors.HexColor("#1A1A1A"))
    c.setFillColor(colors.HexColor("#1A1A1A"))
    
    if icon_type == "email":
        c.rect(x - 6, y - 4, 12, 8, stroke=1, fill=0)
        p = c.beginPath()
        p.moveTo(x - 6, y + 4)
        p.lineTo(x, y - 1)
        p.lineTo(x + 6, y + 4)
        c.drawPath(p, stroke=1, fill=0)
    elif icon_type == "phone":
        p = c.beginPath()
        p.moveTo(x - 4, y + 5)
        p.lineTo(x - 2, y + 5)
        p.lineTo(x - 1, y + 2)
        p.lineTo(x - 3, y)
        p.lineTo(x, y - 3)
        p.lineTo(x + 2, y - 1)
        p.lineTo(x + 5, y - 2)
        p.lineTo(x + 5, y - 4)
        p.lineTo(x + 3, y - 5)
        p.lineTo(x - 1, y - 3)
        p.lineTo(x - 5, y + 1)
        p.lineTo(x - 4, y + 5)
        c.drawPath(p, stroke=1, fill=1)
    elif icon_type == "linkedin":
        c.rect(x - 5, y - 5, 10, 10, stroke=1, fill=0)
        c.setFont("Helvetica-Bold", 7)
        c.drawString(x - 3, y - 3, "in")
    elif icon_type == "github":
        c.circle(x, y, 5, stroke=1, fill=0)
        c.setFont("Helvetica-Bold", 6)
        c.drawString(x - 3.5, y - 2.5, "git")
    elif icon_type == "location":
        c.circle(x, y + 1, 3, stroke=1, fill=0)
        p = c.beginPath()
        p.moveTo(x - 4, y + 2)
        p.lineTo(x, y - 5)
        p.lineTo(x + 4, y + 2)
        c.drawPath(p, stroke=1, fill=0)
    elif icon_type == "node_about":
        c.circle(x, y, 11, stroke=1, fill=1)
        c.setFillColor(colors.white)
        c.circle(x, y + 3, 3, stroke=0, fill=1)
        p = c.beginPath()
        p.moveTo(x - 5, y - 5)
        p.lineTo(x + 5, y - 5)
        p.lineTo(x + 3, y - 1)
        p.lineTo(x - 3, y - 1)
        p.close()
        c.drawPath(p, stroke=0, fill=1)
    elif icon_type == "node_edu":
        c.circle(x, y, 11, stroke=1, fill=1)
        c.setFillColor(colors.white)
        p = c.beginPath()
        p.moveTo(x, y + 5)
        p.lineTo(x - 6, y + 1)
        p.lineTo(x, y - 2)
        p.lineTo(x + 6, y + 1)
        p.close()
        c.drawPath(p, stroke=0, fill=1)
        c.rect(x - 3, y - 5, 6, 3, stroke=0, fill=1)
    elif icon_type == "node_cert":
        c.circle(x, y, 11, stroke=1, fill=1)
        c.setFillColor(colors.white)
        c.rect(x - 5, y - 4, 10, 8, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#1A1A1A"))
        c.rect(x - 3, y - 2, 6, 4, stroke=0, fill=1)
    elif icon_type == "node_proj":
        c.circle(x, y, 11, stroke=1, fill=1)
        c.setFillColor(colors.white)
        c.rect(x - 6, y - 4, 12, 8, stroke=0, fill=1)
        c.rect(x - 2, y + 4, 4, 2, stroke=0, fill=1)
    elif icon_type == "node_ref":
        c.circle(x, y, 11, stroke=1, fill=1)
        c.setFillColor(colors.white)
        c.circle(x - 3, y + 2, 2.5, stroke=0, fill=1)
        c.circle(x + 3, y + 2, 2.5, stroke=0, fill=1)
        c.rect(x - 5, y - 4, 10, 3, stroke=0, fill=1)
    elif icon_type == "small_circle":
        c.setFillColor(colors.white)
        c.setStrokeColor(colors.HexColor("#1A1A1A"))
        c.setLineWidth(1.2)
        c.circle(x, y, 3, stroke=1, fill=1)

    c.restoreState()

def generate_pdf(output_pdf_path, profile_img_path):
    W, H = letter # 612 x 792
    c = canvas.Canvas(output_pdf_path, pagesize=letter)
    c.setTitle("Yasith Mavinda - CV")
    c.setAuthor("Yasith Mavinda")

    styles = getSampleStyleSheet()

    sidebar_title_style = ParagraphStyle(
        'SidebarTitle',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=14,
        textColor=colors.HexColor("#111111")
    )

    sidebar_text_style = ParagraphStyle(
        'SidebarText',
        fontName='Helvetica',
        fontSize=8.8,
        leading=12,
        textColor=colors.HexColor("#111111")
    )

    sidebar_bullet_style = ParagraphStyle(
        'SidebarBullet',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#111111"),
        leftIndent=8,
        firstLineIndent=-6
    )

    main_header_title_style = ParagraphStyle(
        'MainHeaderTitle',
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=15,
        textColor=colors.HexColor("#000000")
    )

    main_body_style = ParagraphStyle(
        'MainBody',
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1A1A1A")
    )

    item_title_style = ParagraphStyle(
        'ItemTitle',
        fontName='Helvetica-Bold',
        fontSize=9.8,
        leading=12.5,
        textColor=colors.HexColor("#000000")
    )

    item_sub_style = ParagraphStyle(
        'ItemSub',
        fontName='Helvetica',
        fontSize=8.8,
        leading=12,
        textColor=colors.HexColor("#222222")
    )

    date_style = ParagraphStyle(
        'DateStyle',
        fontName='Helvetica',
        fontSize=8.8,
        leading=12,
        textColor=colors.HexColor("#111111"),
        alignment=2
    )

    proj_bullet_style = ParagraphStyle(
        'ProjBullet',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#111111"),
        leftIndent=8,
        firstLineIndent=-6
    )

    # 1. DRAW BACKGROUND AREAS
    # Top Banner (Black)
    c.setFillColor(colors.HexColor("#181818"))
    c.rect(0, 655, W, 137, stroke=0, fill=1)

    # Left Sidebar (Gray)
    c.setFillColor(colors.HexColor("#CFCFD1"))
    c.rect(0, 0, 185, 655, stroke=0, fill=1)

    # 2. TOP BANNER CONTENT
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(242, 725, "YASITH MAVINDA")
    c.setFont("Helvetica", 10.5)
    c.drawString(242, 705, "ENTHUSIASTIC MIT UNDERGRADUATE")

    # 3. PROFILE PHOTO
    if os.path.exists(profile_img_path):
        c.drawImage(profile_img_path, 21.5, 580, width=142, height=142, mask='auto')

    # 4. SIDEBAR CONTENT
    y_side = 555
    c.setFillColor(colors.HexColor("#111111"))
    
    # CONTACT SECTION
    p = Paragraph("<b>CONTACT</b>", sidebar_title_style)
    w, h = p.wrap(155, 20)
    p.drawOn(c, 20, y_side - h)
    c.setLineWidth(1)
    c.setStrokeColor(colors.HexColor("#111111"))
    c.line(20, y_side - h - 3, 170, y_side - h - 3)

    y_side = y_side - h - 12
    contacts = [
        ("email", "yasithmavinda@gmail.com"),
        ("phone", "076 905 5019"),
        ("linkedin", "<u>Yasith Mavinda</u>"),
        ("github", "<u>yasithmavinda</u>"),
        ("location", "KP / 15 /5, Kalmunai<br/>Road, Ampara, Sri Lanka")
    ]

    for icon, text in contacts:
        p = Paragraph(text, sidebar_text_style)
        w, h = p.wrap(125, 40)
        draw_icon(c, icon, 28, y_side - (h / 2.0))
        p.drawOn(c, 42, y_side - h)
        y_side -= (h + 8)

    y_side -= 4
    # TECH SKILLS SECTION
    p = Paragraph("<b>TECH SKILLS</b>", sidebar_title_style)
    w, h = p.wrap(155, 20)
    p.drawOn(c, 20, y_side - h)
    c.line(20, y_side - h - 3, 170, y_side - h - 3)
    y_side = y_side - h - 10

    tech_bullets = [
        "<b>Programming & Development:</b> Java, C++, HTML, CSS, Java Script",
        "<b>Database:</b> MySQL",
        "<b>Tools:</b> Figma, MS Office, VS Code"
    ]
    for b in tech_bullets:
        p = Paragraph(f"• {b}", sidebar_bullet_style)
        w, h = p.wrap(150, 60)
        p.drawOn(c, 20, y_side - h)
        y_side -= (h + 5)

    y_side -= 4
    # SOFT SKILLS SECTION
    p = Paragraph("<b>SOFT SKILLS</b>", sidebar_title_style)
    w, h = p.wrap(155, 20)
    p.drawOn(c, 20, y_side - h)
    c.line(20, y_side - h - 3, 170, y_side - h - 3)
    y_side = y_side - h - 10

    soft_bullets = [
        "Time Management & Organization",
        "Collaboration & Teamwork",
        "Problem Solving & Critical Thinking"
    ]
    for b in soft_bullets:
        p = Paragraph(f"• {b}", sidebar_bullet_style)
        w, h = p.wrap(150, 40)
        p.drawOn(c, 20, y_side - h)
        y_side -= (h + 5)

    y_side -= 4
    # LANGUAGE PROFICIENCY SECTION
    p = Paragraph("<b>LANGUAGE PROFICIENCY</b>", sidebar_title_style)
    w, h = p.wrap(155, 20)
    p.drawOn(c, 20, y_side - h)
    c.line(20, y_side - h - 3, 170, y_side - h - 3)
    y_side = y_side - h - 10

    lang_bullets = [
        "English ( Professional proficiency)",
        "Sinhala ( Native proficiency)",
        "Tamil(Basic level )"
    ]
    for b in lang_bullets:
        p = Paragraph(f"• {b}", sidebar_bullet_style)
        w, h = p.wrap(150, 40)
        p.drawOn(c, 20, y_side - h)
        y_side -= (h + 5)


    # 5. RIGHT CONTENT AREA
    c.setLineWidth(1)
    c.setStrokeColor(colors.HexColor("#B0B0B0"))
    c.line(215, 30, 215, 634)

    y_main = 635

    def draw_section_header(title, node_type, y_top):
        p = Paragraph(f"<b>{title}</b>", main_header_title_style)
        w, h = p.wrap(340, 20)
        y_hdr = y_top - h
        draw_icon(c, node_type, 215, y_hdr + (h / 2.0))
        p.drawOn(c, 242, y_hdr)
        c.setLineWidth(1)
        c.setStrokeColor(colors.HexColor("#000000"))
        c.line(242, y_hdr - 3, 585, y_hdr - 3)
        return y_hdr - 12

    # SECTION 1: ABOUT ME
    y_main = draw_section_header("ABOUT ME", "node_about", y_main)
    about_text = (
        "I am currently pursuing my BSc (Hons) in MIT at the University of Kelaniya. "
        "My goal is to apply business strategy, design, and technology to craft impactful "
        "solutions.I am focused on Operations and Supply Chain Management (OSCM)."
    )
    p = Paragraph(about_text, main_body_style)
    w, h = p.wrap(340, 100)
    p.drawOn(c, 242, y_main - h)
    y_main -= (h + 16)

    # SECTION 2: EDUCATION
    y_main = draw_section_header("EDUCATION", "node_edu", y_main)
    
    # Edu Item 1
    p_title = Paragraph("<b>BSc (Hons) in Management and Information Technology (MIT) (Reading)</b>", item_title_style)
    p_date = Paragraph("2025 – Present", date_style)
    w_t, h_t = p_title.wrap(250, 30)
    w_d, h_d = p_date.wrap(80, 20)
    
    draw_icon(c, "small_circle", 215, y_main - (h_t / 2.0))
    p_title.drawOn(c, 242, y_main - h_t)
    p_date.drawOn(c, 500, y_main - h_d)
    
    y_main -= (h_t + 2)
    p_sub = Paragraph("Department of Industrial Management | University of Kelaniya", item_sub_style)
    w_s, h_s = p_sub.wrap(340, 20)
    p_sub.drawOn(c, 242, y_main - h_s)
    
    y_main -= (h_s + 10)

    # Edu Item 2
    p_title = Paragraph("<b>Intermediate English Course</b>", item_title_style)
    p_date = Paragraph("2024", date_style)
    w_t, h_t = p_title.wrap(250, 20)
    w_d, h_d = p_date.wrap(80, 20)

    draw_icon(c, "small_circle", 215, y_main - (h_t / 2.0))
    p_title.drawOn(c, 242, y_main - h_t)
    p_date.drawOn(c, 500, y_main - h_d)

    y_main -= (h_t + 2)
    p_sub = Paragraph("Kekirawa English Academy<br/>10 week", item_sub_style)
    w_s, h_s = p_sub.wrap(340, 40)
    p_sub.drawOn(c, 242, y_main - h_s)

    y_main -= (h_s + 16)

    # SECTION 3: CERTIFICATE
    y_main = draw_section_header("CERTIFICATE", "node_cert", y_main)
    
    p_title = Paragraph("<b>Figma Course</b>", item_title_style)
    p_date = Paragraph("2026", date_style)
    w_t, h_t = p_title.wrap(250, 20)
    w_d, h_d = p_date.wrap(80, 20)

    draw_icon(c, "small_circle", 215, y_main - (h_t / 2.0))
    p_title.drawOn(c, 242, y_main - h_t)
    p_date.drawOn(c, 500, y_main - h_d)

    y_main -= (h_t + 2)
    p_sub = Paragraph("DP Education IT Campus", item_sub_style)
    w_s, h_s = p_sub.wrap(340, 20)
    p_sub.drawOn(c, 242, y_main - h_s)

    y_main -= (h_s + 16)

    # SECTION 4: PROJECT
    y_main = draw_section_header("PROJECT", "node_proj", y_main)

    # Proj 1
    p_title = Paragraph("<b>Salon Booking Management System</b>", item_title_style)
    w_t, h_t = p_title.wrap(340, 20)
    draw_icon(c, "small_circle", 215, y_main - (h_t / 2.0))
    p_title.drawOn(c, 242, y_main - h_t)
    
    y_main -= (h_t + 3)
    b1 = Paragraph("• Developed a booking application to streamline salon operations and appointment scheduling.", proj_bullet_style)
    b2 = Paragraph("• Tools Used: Java, MySQL", proj_bullet_style)
    w1, h1 = b1.wrap(340, 40)
    b1.drawOn(c, 242, y_main - h1)
    y_main -= (h1 + 2)
    w2, h2 = b2.wrap(340, 20)
    b2.drawOn(c, 242, y_main - h2)
    y_main -= (h2 + 10)

    # Proj 2
    p_title = Paragraph("<b>Console-Based Game Development</b>", item_title_style)
    w_t, h_t = p_title.wrap(340, 20)
    draw_icon(c, "small_circle", 215, y_main - (h_t / 2.0))
    p_title.drawOn(c, 242, y_main - h_t)

    y_main -= (h_t + 3)
    b1 = Paragraph("• Developed a console-based game with a team, implementing gameplay logic, input handling, and flow control.", proj_bullet_style)
    b2 = Paragraph("• Tools Used: C++", proj_bullet_style)
    w1, h1 = b1.wrap(340, 40)
    b1.drawOn(c, 242, y_main - h1)
    y_main -= (h1 + 2)
    w2, h2 = b2.wrap(340, 20)
    b2.drawOn(c, 242, y_main - h2)
    y_main -= (h2 + 16)

    # SECTION 5: REFERENCES
    y_main = draw_section_header("REFERENCES", "node_ref", y_main)

    # Ref 1
    ref1_text = (
        "<b>Dr. Amila Withanaarachchi</b><br/>"
        "Senior Lecturer Grade II<br/>"
        "University of Kelaniya<br/>"
        "<u>amilaw@kln.ac.lk</u>"
    )
    p_ref1 = Paragraph(ref1_text, main_body_style)
    w, h = p_ref1.wrap(340, 60)
    draw_icon(c, "small_circle", 215, y_main - 6)
    p_ref1.drawOn(c, 242, y_main - h)
    
    y_main -= (h + 10)

    # Ref 2
    ref2_text = (
        "<b>T.A Dinushi Senadheera</b><br/>"
        "HR officer<br/>"
        "Tabrane pharmaceutical (pvt) Ltd<br/>"
        "076 064 7740<br/>"
        "<u>mal@tabranepharma.com</u>"
    )
    p_ref2 = Paragraph(ref2_text, main_body_style)
    w, h = p_ref2.wrap(340, 70)
    draw_icon(c, "small_circle", 215, y_main - 6)
    p_ref2.drawOn(c, 242, y_main - h)

    # Save PDF
    c.showPage()
    c.save()
    print("PDF saved to:", output_pdf_path)

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    profile_in = os.path.join(project_dir, "images", "profile.jpg")
    profile_circle = os.path.join(script_dir, "profile_circle.png")
    pdf_out = os.path.join(script_dir, "Yasith_Mavinda_CV.pdf")

    prepare_circle_image(profile_in, profile_circle)
    generate_pdf(pdf_out, profile_circle)
