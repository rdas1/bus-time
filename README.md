# Mobile web app for viewing live bus arrival times at NYC bus stations

For my Human-Computer Interaction course at Georgia Tech, I redesigned both the signage and the mobile web app for accessing bus arrival times from MTA bus stops.

I developed a web app, available at [this link](https://rdas1.github.io/bus-time/#/403483), that retrieves and displays bus arrival times for any given stop (specified as a URL parameter). I designed and put up signs at four stations in Upper Manhattan with QR codes that lead to this website, so that real users can view bus arrival times. 

<p float="left" align="center">
    <img src="images/example_sign.JPG" alt="My redesigned signage, posted at the Amsterdam Avenue / W 145th St bus stop" height="400"/>
    <img src="images/example_page.JPG" alt="My redesigned webpage, showing bus arrivals at Amsterdam Avenue / W 145th St bus stop" height="400"/>
    <img src="images/example_map_widget.JPG" alt="Expanding a card reveals a map widget indicating live bus locations." height="400"/>
</p>

So far, they've been totaling about 40 scans per day. I'm planning to put up more signs at other stations across NYC so that more people can easily view bus arrival times.


# Why?

Only 1% of NYC's 15k bus stops have electronic signage indicating bus arrivals times. At all other stops, riders are directed to a software solution called MTA Bus Time via text-heavy, cluttered signs:
<p float="left align="center">
    <img src="images/mta_sign.JPG" alt="Current MTA Signage" height="400"/>
    <img src="images/mta_interface.PNG" alt="Current MTA web interface" height="400"/>
</p>
These signs provide 5 options for accessing bus arrival times. Rather than emphasize the system’s flexibility, this graphic design overwhelms potential users and makes what should be a simple task seem overly complicated. Moreover, the interfaces themselves are difficult and often unpleasant to use. The SMS interface, for example, requires memorizing and typing in an arbitrary 6-digit stopcode to an arbitrary 7-digit number; and the mobile web app, while functional, is visually dated and somewhat jargon-heavy.

<br>
<br>

I wanted to redesign both the mobile web interface and its access point in such a way that I could deploy a live prototype, and provide reliable arrival-time information to real users in my neighborhood (and beyond).
