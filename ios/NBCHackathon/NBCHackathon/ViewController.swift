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
import MGSwipeTableCell

class ViewController: UIViewController, UITableViewDataSource, MGSwipeTableCellDelegate {

	@IBOutlet weak var tavView: UIView!

	@IBOutlet weak var table: UITableView!
	var tableArray = [[String: AnyObject]]()
	override func viewDidLoad() {
		super.viewDidLoad()

		let attributes = [
			NSForegroundColorAttributeName: UIColor.whiteColor(),
			NSFontAttributeName: UIFont(name: "Avenir", size: 40)!
		]
		self.navigationController?.navigationBar.titleTextAttributes = attributes

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
		let leftBut = MGSwipeButton(title: "", icon: UIImage(named: "plus"), backgroundColor: UIColor(hexString: "699B60"), callback: {
			(sender: MGSwipeTableCell!) -> Bool in
			print("check")
			return true
		})
		leftBut.setPadding(20)

		cell.leftButtons = [leftBut]
		cell.leftSwipeSettings.transition = MGSwipeTransition.Drag

		// configure right buttons
		let but = MGSwipeButton(title: "", icon: UIImage(named: "waste"), backgroundColor: UIColor(hexString: "7B0E16"), callback: {
			(sender: MGSwipeTableCell!) -> Bool in
			print("remove")
			let index = self.table.indexPathForCell(sender)
			self.tableArray.removeAtIndex((index?.row)!)
			self.table.deleteRowsAtIndexPaths([index!], withRowAnimation: .Automatic)
			return true
		})
		but.setPadding(20)
		cell.rightButtons = [but]
		cell.delegate = self
		cell.rightSwipeSettings.transition = MGSwipeTransition.Drag

		return cell
	}

	func swipeTableCell(cell: MGSwipeTableCell!, canSwipe direction: MGSwipeDirection) -> Bool {

//    let cel = table.cellForRowAtIndexPath(table.indexPathForCell(cell)!) as! MGSwipeTableCell
//    if direction == MGSwipeDirection.RightToLeft
//    {
//      cel.swipeBackgroundColor = UIColor.blueColor()
//    }
//    else
//    {
//      cel.swipeBackgroundColor = UIColor.greenColor()
//
//    }
		return true
	}
	func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath)
	{
		self.performSegueWithIdentifier("detail", sender: self.tableArray[indexPath.row])
	}

	override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
		let theDestination = (segue.destinationViewController as! DetailViewController)
		let dicinfo = sender
		theDestination.dicInfo = dicinfo as! [String: AnyObject]
	}

	func updateTable(key: String)
	{
		Alamofire.request(.GET, "https://nbchacks2016.mybluemix.net/user")
			.responseJSON { response in
				if let JSON = response.result.value {
					print(JSON)
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
