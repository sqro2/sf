# sf
<p><strong>description : </strong>a straightforward batch file downloader written in node.js.</p>
</br>

<p><strong>Usage : </strong> sf -l [single link] or -d [path/to/file/containing/multiple/urls] [optional]</p>
<p><strong>optional :</strong></p>
<p>-p [name of the project]</p>
</br>
<p><strong>Examples : </strong></p>
<p>-> download a single file : </p>
<p>sf -l https://homepages.cae.wisc.edu/~ece533/images/airplane.png</p>
<p>-> download a single file to a project directory : </p>
<p>sf -l https://homepages.cae.wisc.edu/~ece533/images/airplane.png -p project_name</p>
<p>-> download multiple urls from a file : </p>
<p>sf -d /path/to/file/</p>
<p>-> download multiple urls from a file to a project directory : </p>
<p>sf -d /path/to/file/ -p project_name</p>

</br>
<p><strong>Advantages</strong></p>
<ul>
  <li>Easy to use.</li>
  <li>Automatically resumes broken downloads.</li>
  <li>Does not overwrite existing files which are already downloaded.</li>
  <li>Builds directoris for different file types.</li>
</ul>
</br>
<p><strong>License : <a href='https://opensource.org/licenses/MIT'>MIT</a></strong></p>

