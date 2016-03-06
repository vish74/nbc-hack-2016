//
//  ViewController.swift
//  NBCHackathon
//
//  Created by Lucas Farah on 3/5/16.
//  Copyright © 2016 Lucas Farah. All rights reserved.
//

import UIKit
import Alamofire
import EZSwiftExtensions

class ViewController: UIViewController, UITableViewDataSource {

	@IBOutlet weak var tavView: UIView!

	@IBOutlet weak var table: UITableView!
	var tableArray = [[String: AnyObject]]()
	override func viewDidLoad() {
		super.viewDidLoad()
		// Do any additional setup after loading the view, typically from a nib.
		let img = UIImage(named: "filter")!.imageWithRenderingMode(UIImageRenderingMode.AlwaysOriginal)
		let rightBarButtonItem = UIBarButtonItem(image: img, style: UIBarButtonItemStyle.Plain, target: self, action: "filter")
		self.navigationItem.rightBarButtonItem = rightBarButtonItem

		self.updateTable("_suggested_shows")
	}
	func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int
	{
		return self.tableArray.count
	}

	func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell
	{
		var cell = tableView.dequeueReusableCellWithIdentifier("cell") as! TVShowTableViewCell!
		if !(cell != nil)
		{
			cell = TVShowTableViewCell(style: .Default, reuseIdentifier: "cell")
		}

		let dic = self.tableArray[indexPath.row]
		cell.lblTitleName.text = dic["name"] as? String
		cell.imgvPoster.image = UIImage(urlString: dic["picURL"] as! String)

		return cell
	}

	func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath)
	{
	}

	func updateTable(key: String)
	{
		Alamofire.request(.GET, "https://nbchacks2016.mybluemix.net/user")
			.responseJSON { response in
				if let JSON = response.result.value {

					if let watched = JSON[key]
					{
						self.tableArray = watched as! [[String: AnyObject]]
						self.table.reloadData()
					}
				}
		}
	}
	@IBOutlet weak var listsBar: UIImageView!
	@IBAction func but1(sender: AnyObject)
	{
		self.listsBar.image = UIImage(named: "lists-bar-1")
		self.updateTable("_suggested_shows")
	}
	@IBAction func but2(sender: AnyObject)
	{
		self.listsBar.image = UIImage(named: "lists-bar-2")
		self.updateTable("_shows_to_watch")
	}
	@IBAction func but3(sender: AnyObject)
	{
		self.listsBar.image = UIImage(named: "lists-bar-3")
		self.updateTable("_watched_shows")
	}

	func filter()
	{
		print("filter")
	}
}
